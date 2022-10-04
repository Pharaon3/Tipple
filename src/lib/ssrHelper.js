// https://github.com/davnicwil/react-frontload

import React from 'react'
import PropTypes from 'prop-types'

const autoDetectIsServer = () =>
    typeof window === 'undefined' ||
    !window.document ||
    !window.document.createElement

const IS_SERVER = autoDetectIsServer()

let SERVER_FRONTLOAD_QUEUE = []

const LIFECYCLE_PHASES = {
    MOUNT: 0,
    UPDATE: 1,
}

const log =
    process.env.NODE_ENV !== 'production' &&
    ((name, message) => {
        console.log(`[react-frontload]${name ? ` [${name}]` : ''} ${message}`)
    })

const map = (arr, fn) => {
    const mapped = []

    for (let i = 0; i < arr.length; i++) {
        mapped.push(fn(arr[i], i))
    }

    return mapped
}

// util with same behaviour of Promise.all, except it does not short-circuit
// to catch if one of the promises rejects. It resolves when all the passed promises
// have either resolved or rejected
const waitForAllToComplete = (promises) =>
    Promise.all(map(promises, (promise) => promise['catch']((error) => error)))

export class SSRHelper extends React.Component {
    static childContextTypes = {
        frontload: PropTypes.object,
    }

    getChildContext() {
        return {
            frontload: {
                isServer: this.isServer,
                firstClientRenderDone: this.isServer
                    ? true
                    : this.firstClientRenderDone,

                pushFrontload: (
                    frontload,
                    options,
                    lifecylePhase,
                    childProps,
                ) => {
                    const isMount = lifecylePhase === LIFECYCLE_PHASES.MOUNT
                    const isUpdate = lifecylePhase === LIFECYCLE_PHASES.UPDATE
                    const noServerRender =
                        this.props.noServerRender || options.noServerRender

                    if (
                        (this.isServer && noServerRender) ||
                        (isMount && options.onMount === false) || // onMount default true
                        (isUpdate && !options.onUpdate) // onUpdate default false
                    ) {
                        return
                    }

                    if (this.isServer) {
                        SERVER_FRONTLOAD_QUEUE.unshift({
                            fn: () => frontload(childProps, { isMount, isUpdate }),
                            options,
                            componentDisplayName: childProps.displayName,
                        })

                    } else if (noServerRender || this.firstClientRenderDone) {
                        frontload(childProps, { isMount, isUpdate })

                    }
                },
            },
        }
    }

    constructor(props, context) {
        super(props, context)

        this.isServer = props.isServer === undefined ? IS_SERVER : props.isServer

        // hook for first ever render on client
        // by default, no frontloads are run on first render, because it is assumed that server rendering is being used
        // to run all frontloads and fetch data on the server, such that fresh data is available for this first client
        // render. However, this setup may not be appropriate for every app. We may want to rerun the frontload
        // functions on the first render on the client for certain, or all, components, for example if server
        // rendering is not set up at all, or if data may be stale at the time of first client render due to
        // server-side caching. There are 2 options to configure rerunning the frontload fn(s)
        // on first render - in a per-frontload option { noServerRender: true }, or in a prop on this
        // Frontload provider: { noServerRender: true }, which of course enables this for all frontload fns
        this.componentDidMount = () => {
            this.firstClientRenderDone = true

            if (
                process.env.NODE_ENV !== 'production' &&
                props.withLogging &&
                !props.noServerRender
            ) {
                log(
                    props.name,
                    '1st client render done, from now on all frontloads will run',
                )
            }
        }
    }

    render() {
        return React.Children.only(this.props.children)
    }
}

class FrontloadConnectedComponent extends React.Component {
    static contextTypes = {
        frontload: PropTypes.object
    }

    constructor(props, context) {
        super(props, context)

        if (context.frontload.isServer) {
            this.UNSAFE_componentWillMount = this.pushFrontload(LIFECYCLE_PHASES.MOUNT)
        } else {
            this.componentDidMount = this.pushFrontload(LIFECYCLE_PHASES.MOUNT)
            this.componentDidUpdate = this.pushFrontload(LIFECYCLE_PHASES.UPDATE)
        }
    }

    pushFrontload = (lifecyclePhase) => () => {
        this.context.frontload.pushFrontload(
            this.props.component.getInitialProps,
            {},
            lifecyclePhase,
            this.props.componentProps)
    }

    render() {
        return <this.props.component {...this.props.componentProps} />
    }
}

export const ssrComponent = (component) => (
    props,
) => (
        <FrontloadConnectedComponent
            component={component}
            componentProps={props}
            options={{

            }}
        />
    )

function dryRunRender(renderFunction) {
    renderFunction(true)

    const frontloadsFromRender = SERVER_FRONTLOAD_QUEUE
    SERVER_FRONTLOAD_QUEUE = []

    return frontloadsFromRender
}

function runAllFrontloads(frontloads) {
    return waitForAllToComplete(map(frontloads, (frontload) => frontload.fn()))
}

function finalRender(renderFunction) {
    const renderOutput = renderFunction(false)

    SERVER_FRONTLOAD_QUEUE = []

    return renderOutput
}

function frontloadServerRenderWorker(
    render,
    { withLogging, maxNestedFrontloadComponents },
    renderNumber = 1,
    frontloadsInLastRender = 0,
) {

    // do a dry run render pass
    const frontloadsFromRender = dryRunRender(render)

    // count the newly collected frontloads from this render pass
    const frontloadsInThisRender = frontloadsFromRender.length + 0
    const newFrontloadsInThisRender =
        frontloadsInThisRender - frontloadsInLastRender

    // if there are no new frontloads from this render pass then we are done, and need to render and return the final output
    if (!newFrontloadsInThisRender) {

        const finalRenderOutput = finalRender(render)

        // the return value of this function has to be a Promise
        return Promise.resolve(finalRenderOutput)
    }

    // if there are new frontloads from this render pass, run them all, then do another render pass
    return runAllFrontloads(frontloadsFromRender).then(() => {

        if (renderNumber === maxNestedFrontloadComponents) {

            const incompleteRenderOutput = render(false)

            SERVER_FRONTLOAD_QUEUE = []

            return incompleteRenderOutput
        }

        return frontloadServerRenderWorker(
            render,
            { withLogging, maxNestedFrontloadComponents },
            renderNumber + 1,
            frontloadsInThisRender,
        )
    })
}

export function ssrHelperServerRender(render, options = {}) {
    if (!options.maxNestedFrontloadComponents) {
        // 1 (i.e. nesting OFF) is the default to not change behaviour from earlier 1.x versions
        options.maxNestedFrontloadComponents = 1
    }

    // delegate work to a private worker function so as to not expose the third and fourth arguments to the public API
    return frontloadServerRenderWorker(render, options)
}