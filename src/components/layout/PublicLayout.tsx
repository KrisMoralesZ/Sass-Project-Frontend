import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { paths } from '@/routes/paths'

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const BrandLink = styled(Link)`
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
`

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.focus};
  }
`

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};
`

/**
 * Guest shell for login/register and other unauthenticated screens.
 * First layout converted to styled-components (task 0.1.4.4 smoke test).
 */
export function PublicLayout() {
  return (
    <Shell>
      <Header>
        <BrandLink to={paths.login}>Sass Project</BrandLink>
        <Nav aria-label="Public">
          <NavLink to={paths.login}>Sign in</NavLink>
          <NavLink to={paths.register}>Create account</NavLink>
        </Nav>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Shell>
  )
}
