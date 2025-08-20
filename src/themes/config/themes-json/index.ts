import light from "./light.json";
import dark from "./dark.json";
import elementary from "./elementary.json";
import sovereign from "./sovereign.json";
import cinder from "./cinder.json";
import artisan from "./artisan.json";
import cyberpunk from "./cyberpunk.json";
import dark_elegance from "./dark-elegance.json";
import dessert_sand from "./desert-sand.json";
import cotton_candy from "./cotton-candy.json";
import minimal_dark from "./minimal-dark.json";
import minimal_green from "./minimal-green.json";
import minty_breeze from "./minty-breeze.json";
import moss_green from "./moss-green.json";
import ocean_mist from "./ocean-mist.json";
import pastal_breeze from "./pastal-breeze.json";
import retro_neon from "./retro-neon.json";;
import sage_calm from "./sage-calm.json";
import solarized_dark from "./solarized-dark.json";
import sunset_glow from "./sunset-glow.json"
import { Theme } from "../ThemeStore";

export const defaultThemes: Record<string, Theme> = {
  [light.name]: light,
  [dark.name]: dark,
  [elementary.name]: elementary,
  [sovereign.name]: sovereign,
  [cinder.name]: cinder,
  [artisan.name]: artisan,
  [cyberpunk.name]: cyberpunk,
  [dark_elegance.name]: dark_elegance,
  [dessert_sand.name]: dessert_sand,
  [cotton_candy.name]: cotton_candy,
  [minimal_dark.name]: minimal_dark,
  [minimal_green.name]: minimal_green,
  [minty_breeze.name]: minty_breeze,
  [moss_green.name]: moss_green,
  [ocean_mist.name]: ocean_mist,
  [pastal_breeze.name]: pastal_breeze,
  [retro_neon.name]: retro_neon,
  [sage_calm.name]: sage_calm,
  [solarized_dark.name]: solarized_dark,
  [sunset_glow.name]: sunset_glow,

};
