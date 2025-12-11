import {Route, Routes} from "react-router";
import {MainPage} from "@/pages/mainPage";
import {AddPage} from "@/pages/adPage";
import {NoMatchPage} from "@/pages/noMatchPage";

const App = () => {
    const navigationRoutes = [
        {path: '/', element: <MainPage />},
        {path: `/ads/:id`, element: <AddPage/>},
        {path: '*', element: <NoMatchPage />},
    ]
    return (
        <div className='container'>
            <Routes>{navigationRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}</Routes>
        </div>
    );
};

export default App;