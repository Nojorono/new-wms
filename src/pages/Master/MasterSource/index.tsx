import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterSource() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Source" }]} />
      <DataTable />
    </div>
  );
}
