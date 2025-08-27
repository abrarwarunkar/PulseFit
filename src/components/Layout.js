import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Removed Clerk imports
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as MealIcon,
  Timeline as ProgressIcon,
  TrackChanges as GoalsIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'AI Coach', path: '/ai-coach', icon: <AIIcon /> },
  { text: 'Workouts', path: '/workout', icon: <WorkoutIcon /> },
  { text: 'Meals', path: '/meal', icon: <MealIcon /> },
  { text: 'Progress', path: '/progress', icon: <ProgressIcon /> },
  { text: 'Goals', path: '/goals', icon: <GoalsIcon /> },
  { text: 'Profile', path: '/profile', icon: <ProfileIcon /> },
];

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Mock user for demo
  const user = { firstName: 'Demo User', imageUrl: null };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    // Demo mode - no actual logout
    alert('Demo mode - logout disabled');
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #00E5FF, #FF6B35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: 'white',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}>
              P
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #00E5FF, #FF6B35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
          }}>
            PulseFit AI
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #00E5FF, #FFFFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
          }}>
            {user?.firstName ? `👋 Welcome, ${user.firstName}!` : '👋 Welcome!'}
          </Typography>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{ p: 0, ml: 2 }}
          >
            <Avatar src={user?.imageUrl} alt={user?.firstName}>
              {!user?.imageUrl && <ProfileIcon />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
