import { createServerFn } from "@tanstack/react-start";
import { createThemeCookie } from "start-theme/server";

const themeCookie = createThemeCookie({ key: "_preferred-theme" });

export const getTheme = createServerFn().handler(() => themeCookie.read());

export const setTheme = createServerFn({ method: "POST" })
	.inputValidator(themeCookie.validate)
	.handler(({ data }) => themeCookie.write(data));

export type { Theme } from "start-theme";
