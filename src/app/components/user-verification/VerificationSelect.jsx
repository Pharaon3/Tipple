import React, { useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import classNames from 'classnames';
import styles from './VerificationSelect.module.scss';
// import { CircleFlag } from 'react-circle-flags';
// import Flags from 'http://content.tipple.com.au/tipple/countries/list.json';

const verificationType = {
  LICENCE: 'LICENCE',
  PASSPORT: 'PASSPORT',
};

const VerificationSelect = ({ onContinue }) => {
  const [idType, setIdType] = useState();
  const [select, setSelect] = useState('AU');
  const onSelect = (code) => {
    setSelect(code);
    setIdType();
  };
  // const Flags = JSON.parse(Flags).countries;
  // console.log('Flags: ', Flags);

  return (
    <div style={{ color: 'black' }}>
      <h6>Select issuing country/region</h6>
      {/* <CircleFlag countryCode="es" height="35" /> */}
      <ReactFlagsSelect
        selected={select}
        onSelect={onSelect}
        className={styles.countrycontainer}
        // countries={["ALA", "ZWE"]}
        /*showSelectedLabel={showSelectedLabel}
				selectedSize={selectedSize}
				showOptionLabel={showOptionLabel}
				optionsSize={optionsSize}
				placeholder={placeholder}
				searchable={searchable}
				searchPlaceholder={searchPlaceholder}
				alignOptionsToRight={alignOptionsToRight}
				fullWidth={fullWidth}
				disabled={disabled} */
      />

      <h6 style={{ marginBottom: 2 }}>Select ID type</h6>
      <p>Use a valid government-issued photo ID</p>
      <div>
        {select === 'AU' ? (
          <>
            <div
              className={classNames(
                styles.container,
                idType === verificationType.LICENCE ? styles.active : ''
              )}
              onClick={() => setIdType(verificationType.LICENCE)}
            >
              <div className={styles.containerImg}>
                <img src="/static/assets/img/license.png" alt="licence" />
                &nbsp;<label className={styles.labels}> Licence </label>
              </div>
            </div>
            {/* <div style={{ height: 24 }} /> */}
          </>
        ) : (
          ''
        )}

        <div
          className={classNames(
            styles.container,
            idType === verificationType.PASSPORT ? styles.active : ''
          )}
          onClick={() => setIdType(verificationType.PASSPORT)}
        >
          <div className={styles.containerImg}>
            <img src="/static/assets/img/passport.png" alt="passport" />
            &nbsp;<label className={styles.labels}>Passport</label>
          </div>
        </div>
      </div>
      <div>
        <button
          disabled={idType ? false : true}
          className={styles.btnContinue}
          onClick={() => onContinue(idType, select)}
        >
          <p className={styles.btnLabel}> Continue </p>
        </button>
      </div>
    </div>
  );
};

VerificationSelect.propTypes = {};

export default VerificationSelect;
