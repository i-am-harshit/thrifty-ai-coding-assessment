import { ThemeSwitchPane } from "./styles";

export default function ThemeSwitch({ onThemeChange }) {
  return (
    <ThemeSwitchPane>
      {/* <ThemeIcon src={isDark ? sunIconLight : sunIconDark} alt="" /> */}
      {/* <Switch initialState={!isDark} onClick={onThemeChange} /> */}
      {/* <ThemeIcon src={isDark ? moonIconLight : moonIconDark} alt="" /> */}
    </ThemeSwitchPane>
  );
}
