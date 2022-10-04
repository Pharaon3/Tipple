import React from 'react';
import { useSelector } from 'react-redux';
import Loadable from 'react-loadable';
import themeConfig from '../themeConfig';
import { getHostname } from 'app/utils/getHostname';
import Unavailable from 'app/components/unavailable/templates/DefaultUnavailable';

const loading = () => {
  return null;
}

const ThemeErrorHandler = ({ children }) => {
  const theme = useSelector(store => store.theme);

  if (theme.hasError) {
    const hostname = getHostname().replace(/\.xyz$/, '.com.au').toLowerCase();
    const key = Object.keys(themeConfig.domains).find(key => key.toLowerCase() === hostname);
    const domainConfig = themeConfig.domains[key];

    if (domainConfig) {
      const UnavailableComponent = domainConfig?.unavailableComponent ?
        Loadable({
          loader: () => import(`app/components/unavailable/templates/${domainConfig?.unavailableComponent}`),
          loading
        }) : Unavailable;

      return <UnavailableComponent />;
    }
    return <Unavailable />
  } 

  return children;
}

export default ThemeErrorHandler;