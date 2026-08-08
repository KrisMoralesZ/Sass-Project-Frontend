import { type FC, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { paths } from '@/routes/paths'
import {
  $BrandLink,
  $BrandMark,
  $BrandMeta,
  $Content,
  $ContentInner,
  $Header,
  $Nav,
  $NavButtonLink,
  $NavLink,
  $Shell,
} from './PublicLayout.sc'

export interface IPublicLayout {
  /** Storybook / tests. Router routes use `<Outlet />` when omitted. */
  children?: ReactNode
}

/**
 * Guest shell for login/register and other unauthenticated screens.
 * Restyled with Canopy tokens (task 0.2.8).
 */
const PublicLayout: FC<IPublicLayout> = ({ children }) => {
  return (
    <$Shell>
      <$Header>
        <$BrandLink to={paths.login}>
          <$BrandMark>Sass Project</$BrandMark>
          <$BrandMeta>Workspace</$BrandMeta>
        </$BrandLink>
        <$Nav aria-label="Public">
          <$NavLink to={paths.login}>Sign in</$NavLink>
          <$NavButtonLink to={paths.register}>Create account</$NavButtonLink>
        </$Nav>
      </$Header>
      <$Content>
        <$ContentInner>{children ?? <Outlet />}</$ContentInner>
      </$Content>
    </$Shell>
  )
}

export default PublicLayout
