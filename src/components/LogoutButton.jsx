import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';

export default function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default: redirect to /login
      window.location.href = '/login';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 88,
        left: 16,
        zIndex: 2000,
      }}
    >
      <IconButton
        onClick={handleLogout}
        sx={{
          width: 56,
          height: 56,
          bgcolor: '#181818',
          color: '#fff',
          borderRadius: '50%',
          boxShadow: 2,
          '&:hover': { bgcolor: '#333' },
        }}
      >
        <LogoutIcon sx={{ fontSize: 36 }} />
      </IconButton>
    </Box>
  );
}
