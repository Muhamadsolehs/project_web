import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import Login from "./pages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Admin/Home";
import KelolaSiswa from "./pages/Admin/Siswa/view";
import KelolaPengajar from "./pages/Admin/Pengajar/view";
import KelolaJurusan from "./pages/Admin/Jurusan/view";
import KelolaKelas from "./pages/Admin/Kelas/view";
import KelolaMapel from "./pages/Admin/Mapel/view";
import KelolaTahun from "./pages/Admin/Tahun/view";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

          <Route index path="/" element={<Login />} />



          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* <Route index path="/" element={<Home />} /> */}
            <Route path="/Admin/Home" element={<Home />} />


            <Route path="/kelolaSiswa" element={<KelolaSiswa />} />
            <Route path="/kelolaPengajar" element={<KelolaPengajar />} />
            <Route path="/kelolaJurusan" element={<KelolaJurusan />} />
            <Route path="/kelolaKelas" element={<KelolaKelas />} />
            <Route path="/kelolaMapel" element={<KelolaMapel />} />
            <Route path="/kelolaTahun" element={<KelolaTahun />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </>
  );
}
