import { stringify } from 'javascript-stringify';
function stringifyJS(value, styleGuide) {
    const result = stringify(value, (val, indent, stringify, key) => {
        if (key === 'CREATE_ALIAS_SETTING_PLACEHOLDER')
            return `(${stringify(val)})`;
        return stringify(val);
    }, 2);
    return result.replace('CREATE_ALIAS_SETTING_PLACEHOLDER: ', `...require('eslint-config-${styleGuide}/createAliasSetting')`);
}
;
export default stringifyJS;
