import light from "./light.json";
import dark from "./dark.json";
import elementary from "./elementary.json";
import sovereign from "./sovereign.json";
import cinder from "./cinder.json";
import artisan from "./artisan.json";
import { Theme } from "../ThemeStore";

export const defaultThemes: Record<string, Theme> = {
  [light.name]: light,
  [dark.name]: dark,
  [elementary.name]: elementary,
  [sovereign.name]: sovereign,
  [cinder.name]: cinder,
  [artisan.name]: artisan,
};
