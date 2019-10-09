import { module } from "./store";
import { createModule } from "@vue-storefront/core/lib/module";
import { beforeRegistration } from "./hooks/beforeRegistration";
import { afterRegistration } from "./hooks/afterRegistration";

export const KEY = "payone";
export const Payone = createModule({
  key: KEY,
  store: { modules: [{ key: KEY, module }] },
  beforeRegistration,
  afterRegistration
});
