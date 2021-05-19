import { useTranslation } from "react-i18next";

import translations from "../../public/locales/en/translation.json";
import { Paths } from "../types/Path";

type TranslationKeys = Paths<typeof translations>;

export const useTypeSafeTranslation = () => {
  const { t } = useTranslation();
  return { t: (s: TranslationKeys) => t(s) };
};
