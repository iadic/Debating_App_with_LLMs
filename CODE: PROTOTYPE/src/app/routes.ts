import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import CharacterPersonalizationPage from './pages/CharacterPersonalizationPage';
import LevelChoicePage from './pages/LevelChoicePage';
import ExtraInfoPage from './pages/ExtraInfoPage';
import AllModalitiesPage from './pages/AllModalitiesPage';
import OnlyTextModalityPage from './pages/OnlyTextModalityPage';
import OnlyVoiceModalityPage from './pages/OnlyVoiceModalityPage';
import DebateSummaryPage from './pages/DebateSummaryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/personalize',
    Component: CharacterPersonalizationPage,
  },
  {
    path: '/levels',
    Component: LevelChoicePage,
  },
  {
    path: '/extra-info',
    Component: ExtraInfoPage,
  },
  {
    path: '/debate/multimodal',
    Component: AllModalitiesPage,
  },
  {
    path: '/debate/text',
    Component: OnlyTextModalityPage,
  },
  {
    path: '/debate/voice',
    Component: OnlyVoiceModalityPage,
  },
  {
    path: '/debate/summary',
    Component: DebateSummaryPage,
  },
]);