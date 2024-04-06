import { useNavigate } from 'react-router-dom';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

import TransparentButton from 'common/Components/Button/TransparentButton';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <TransparentButton
      className="btnBack"
      onClick={(e: React.MouseEvent) => navigate(-1)}
    >
      <KeyboardArrowLeftRoundedIcon fontSize="medium" /> 목록으로
    </TransparentButton>
  );
}
