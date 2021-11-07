import * as React from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  CssBaseline,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Icon,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle, VideoCall } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/dist/client/router";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import { Roles } from "../types/type";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface LinkItemProps {
  name: string;
  icon: any;
  route: string;
}

const TrainerRoutes: Array<LinkItemProps> = [
  { name: "Halaman Utama", icon: "home", route: "/trainers" },
  {
    name: "Ruang Kelas",
    icon: "event",
    route: "/trainers/events",
  },
  { name: "Videos", icon: "video_library", route: "/videos" },
  {
    name: "Daftarkan Member",
    icon: "people",
    route: "/childrens",
  },
  {
    name: "Settings",
    icon: "settings",
    route: "/settings",
  },
];

const AdminRoutes: Array<LinkItemProps> = [
  { name: "Halaman Utama", icon: "home", route: "/admins" },
  {
    name: "Ruang Kelas",
    icon: "event",
    route: "/admins/events",
  },
  { name: "Videos", icon: "video_library", route: "/admins/videos" },
  { name: "Category", icon: "tag", route: "/admins/categories" },
  {
    name: "Member",
    icon: "people",
    route: "/admins/members",
  },
  { name: "Homepage Editor", icon: "web", route: "/?editor=true" },
  {
    name: "Settings",
    icon: "settings",
    route: "/settings",
  },
];

const MemberRoutes: Array<LinkItemProps> = [
  { name: "Halaman Utama", icon: "home", route: "/members" },
  {
    name: "Acara Anda",
    icon: "event",
    route: "/members/events",
  },
  { name: "Videos", icon: "video_library", route: "/videos" },
  {
    name: "Daftarkan Member",
    icon: "people",
    route: "/childrens",
  },
  {
    name: "Settings",
    icon: "settings",
    route: "/settings",
  },
];

const PaymentRoutes: Array<LinkItemProps> = [
  { name: "Halaman Utama", icon: "money", route: "/members" },
];

const LinkItems: { [e: string]: Array<LinkItemProps> } = {
  payments: PaymentRoutes,
  members: MemberRoutes,
  trainers: TrainerRoutes,
  admins: AdminRoutes,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  const { pathname, push } = useRouter();

  const { user, setUser } = useUserStore();

  const { setToken } = useAuthStore();
  const routeName = user?.roles?.toLowerCase() + "s";

  const notPayed = !user?.subscription_verified && user?.roles == Roles.Member;

  const logout = () => {
    setToken("");
    setUser(null);
    window.location.replace("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {anchorEl && (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      )}
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            CrptoEdu
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "flex" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => {
                push("/notifications");
              }}
            >
              <Badge
                badgeContent={user?.basicnotificationsCount ?? 0}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {LinkItems[notPayed ? "payments" : routeName]?.map(
            ({ icon, name, route }) => (
              <ListItem button key={name} onClick={() => push(route)}>
                <ListItemIcon>
                  <Icon>{icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
