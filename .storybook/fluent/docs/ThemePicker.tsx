// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/docs/ThemePicker.tsx
// (MIT, see ../LICENSE). Changes: imports from @fluentui/react-components.
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

import { THEME_ID } from '../constants';
import type { Theme, ThemeIds } from '../theme';

const useStyles = makeStyles({
  menuButton: {
    minWidth: '210px',
    justifyContent: 'flex-start',
  },

  chevronIcon: {
    marginLeft: 'auto',
  },

  menuPopover: {
    minWidth: '210px',
  },
});

/**
 * Theme picker used in the react-components docs header
 */
export const ThemePicker: React.FC<{ selectedThemeId?: string; themes: Theme[] }> = ({ selectedThemeId, themes }) => {
  const styles = useStyles();
  const [currentThemeId, setCurrentThemeId] = React.useState(selectedThemeId ?? null);

  const setGlobalTheme = (themeId: ThemeIds): void => {
    addons.getChannel().emit('updateGlobals', { globals: { [THEME_ID]: themeId } });
  };
  const onCheckedValueChange: MenuProps['onCheckedValueChange'] = (e, data) => {
    const newThemeId = data.checkedItems[0] as ThemeIds;
    setGlobalTheme(newThemeId);
    setCurrentThemeId(newThemeId);
  };

  const selectedTheme = themes.find(theme => theme.id === currentThemeId);

  return (
    <Menu
      // eslint-disable-next-line react/jsx-no-bind
      onCheckedValueChange={onCheckedValueChange}
      checkedValues={{ theme: selectedThemeId ? [selectedThemeId] : [] }}
      positioning={{ autoSize: true }}
    >
      <MenuTrigger>
        <MenuButton className={styles.menuButton} menuIcon={{ className: styles.chevronIcon }}>
          {selectedTheme?.label ?? 'Theme'}
        </MenuButton>
      </MenuTrigger>
      <MenuPopover className={styles.menuPopover}>
        <MenuList>
          {themes.map(theme => (
            <MenuItemRadio name="theme" value={theme.id} key={theme.id}>
              {theme.label}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
