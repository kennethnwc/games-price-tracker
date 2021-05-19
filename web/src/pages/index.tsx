import { useTypeSafeTranslation } from "../hooks/useTypeSafeTranslation";
const IndexPage = () => {
  const { t } = useTypeSafeTranslation();
  return <div>{t("header.title")}</div>;
};

export default IndexPage;
