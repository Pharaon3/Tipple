import React, { Component } from 'react';
import styles from './Banner.module.scss';

class Banner extends Component {

    componentDidMount() {
        this.currentBanner = 0;

        this.autoScroller = setInterval(() => {

            if (!this.props.banners.items) {
                return;
            }

            let banners = this.props.banners.items.length;

            if (this.currentBanner + 1 >= banners) {
                this.currentBanner = 0;
            } else {
                this.currentBanner = this.currentBanner + 1;
            }

            const _C = document.querySelector('.imageContainer');

            if (_C !== undefined && _C !== null) {
                _C.style.setProperty('--i', this.currentBanner);
            }

        }, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.autoScroller);
        // window.removeEventListener('mouseup', move, false);
    };

    componentDidUpdate() {
        let that = this;

        let i = 0, x0 = null, locked = false, w, ini, fin, rID = null, anf;

        const _C = this.imageContainer;

        if (!this.props.banners.items || _C === undefined) {
            return;
        }

        this.totalBanners = this.props.banners.items.length;
        const NF = 30;
        const TFN = {
            'ease-in-out': function (k) {
                return .5 * (Math.sin((k - .5) * Math.PI) + 1)
            }
        };

        function ani(cf = 0) {
            that.currentBanner = ini + (fin - ini) * TFN['ease-in-out'](cf / anf);
            _C.style.setProperty('--i', that.currentBanner);

            if (cf === anf) {
                stopAni();
                return
            }

            rID = requestAnimationFrame(ani.bind(this, ++cf))
        };


        function drag(e) {
            e.preventDefault();

            if (locked) {
                let dx = unify(e).clientX - x0, f = +(dx / w).toFixed(2);
                that.currentBanner = i - f;
                _C.style.setProperty('--i', that.currentBanner)
            }
        };


        function stopAni() {
            cancelAnimationFrame(rID);
            rID = null
        };

        function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

        function lock(e) {
            x0 = unify(e).clientX;
            locked = true
        };

        function move(e) {
            if (locked) {
                let dx = unify(e).clientX - x0,
                    s = Math.sign(dx),
                    f = +(s * dx / w).toFixed(2);

                ini = i - s * f;

                if ((i > 0 || s < 0) && (i < that.totalBanners - 1 || s > 0) && f > .2) {
                    i -= s;
                    f = 1 - f
                }

                fin = i;
                anf = Math.round(f * NF);
                ani();
                x0 = null;
                locked = false;
            }
        };

        function size() { w = window.innerWidth };

        size();

        if (!_C) {
            return;
        }

        _C.style.setProperty('--n', this.totalBanners);

        _C.addEventListener('resize', size, false);

        _C.addEventListener('touchstart', lock, false);
        _C.addEventListener('touchmove', drag, false);
        _C.addEventListener('touchend', move, false);

        _C.addEventListener('mousedown', lock, false);
        _C.addEventListener('mousemove', drag, false);
        window.addEventListener('mouseup', move, false);
    }


    render() {

        if (!this.props.banners || !this.props.banners.items || this.props.banners.items.length === 0) {
            return <div />
        }

        // switch(size) {
        //     case 'small':
        //         return 'https://content.tipple.com.au/tipple/banners/240x120/' + this.background_image;
        //     case 'medium':
        //         return 'https://content.tipple.com.au/tipple/banners/480x240/' + this.background_image;
        //     default:
        //         return 'https://content.tipple.com.au/tipple/banners/600x300/' + this.background_image;
        // }

        return <div className={styles.banner}>
            <div className="bannerContainer">
                <div className="imageContainer" ref={ic => this.imageContainer = ic}>

                    {this.props.banners && this.props.banners.items.map(x => <a style={{
                        backgroundColor: x.backgroundColor
                    }} key={x.id} href={x.link}><img src={/^https/.test(x.backgroundImage) ? x.backgroundImage : "https://content.tipple.com.au/tipple/banners/1029x300/" + x.backgroundImage} alt={x.title} /></a>)}
                </div>
            </div>
        </div>
    }

}

export default Banner;
