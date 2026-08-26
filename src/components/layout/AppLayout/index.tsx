import { type FC, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useLogout } from '@/features/auth'
import { OrganizationSwitcher } from '@/components/layout/OrganizationSwitcher'
import { paths } from '@/routes/paths'
import {
  $BrandLink,
  $BrandMark,
  $BrandMeta,
  $Main,
  $MainInner,
  $Nav,
  $NavItem,
  $Shell,
  $Sidebar,
  $SidebarFooter,
} from './AppLayout.sc'

const navItems = [
  { to: paths.home, label: 'Home', end: true },
  { to: paths.projects, label: 'Projects', end: false },
  { to: paths.boards, label: 'Boards', end: false },
  { to: paths.members, label: 'Members', end: false },
  { to: paths.settings, label: 'Settings', end: false },
] as const

export interface IAppLayout {
  /** Storybook / tests. Router routes use `<Outlet />` when omitted. */
  children?: ReactNode
}

/**
 * Authenticated workspace shell with Canopy styling and nav placeholders
 * (task 0.2.9).
 */
const AppLayout: FC<IAppLayout> = ({ children }) => {
  const { signOut, isLoggingOut } = useLogout()

  return (
    <$Shell>
      <$Sidebar>
        <$BrandLink to={paths.home}>
          <$BrandMark>Sass Project</$BrandMark>
          <$BrandMeta>Workspace</$BrandMeta>
        </$BrandLink>
        <OrganizationSwitcher />
        <$Nav aria-label="Workspace">
          {navItems.map((item) => (
            <$NavItem key={item.to} to={item.to} end={item.end}>
              {item.label}
            </$NavItem>
          ))}
        </$Nav>
        <$SidebarFooter>
          <Button
            type="button"
            variant="ghost"
            loading={isLoggingOut}
            onClick={() => void signOut()}
          >
            Sign out
          </Button>
        </$SidebarFooter>
      </$Sidebar>
      <$Main>
        <$MainInner>{children ?? <Outlet />}</$MainInner>
      </$Main>
    </$Shell>
  )
}

export default AppLayout
