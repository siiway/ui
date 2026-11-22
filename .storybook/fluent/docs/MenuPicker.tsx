// Not in Fluent's addon: their ThemePicker (./ThemePicker.tsx), for any
// global with a few values. The docs header uses it for the language and the
// direction, where Fluent has a switch for the direction.
import * as React from 'react';
import { addons } from 'storybook/preview-api';

import {
  Menu,
  MenuButton,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  type MenuProps,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  menuButton: {
    minWidth: '150px',
    justifyContent: 'flex-start',
  },

  chevronIcon: {
    marginLeft: 'auto',
  },

  menuPopover: {
    minWidth: '150px',
  },
});

export interface MenuPickerOption<T extends string> {
  value: T;
  label: string;
  /** The label's language, when it isn't the page's. */
  lang?: string;
}

/**
 * A global's picker in the docs header, as Fluent's theme picker
 */
export function MenuPicker<T extends string>({
  name,
  globalId,
  value,
  options,
}: {
  /** What it picks, for screen readers: "Language". */
  name: string;
  /** The Storybook global it sets. */
  globalId: string;
  value: T;
  options: MenuPickerOption<T>[];
}): React.ReactElement {
  const styles = useStyles();
  const [current, setCurrent] = React.useState(value);

  const onCheckedValueChange: MenuProps['onCheckedValueChange'] = (e, data) => {
    const next = data.checkedItems[0] as T;
    addons.getChannel().emit('updateGlobals', { globals: { [globalId]: next } });
    setCurrent(next);
  };

  const selected = options.find(option => option.value === current) ?? options[0]!;

  return (
    <Menu
      // eslint-disable-next-line react/jsx-no-bind
      onCheckedValueChange={onCheckedValueChange}
      checkedValues={{ [name]: [current] }}
      positioning={{ autoSize: true }}
    >
      <MenuTrigger>
        <MenuButton
          className={styles.menuButton}
          menuIcon={{ className: styles.chevronIcon }}
          aria-label={`${name}: ${selected.label}`}
        >
          <span lang={selected.lang}>{selected.label}</span>
        </MenuButton>
      </MenuTrigger>
      <MenuPopover className={styles.menuPopover}>
        <MenuList>
          {options.map(option => (
            <MenuItemRadio name={name} value={option.value} key={option.value} lang={option.lang}>
              {option.label}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
