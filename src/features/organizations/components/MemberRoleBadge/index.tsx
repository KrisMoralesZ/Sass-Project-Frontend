import { type FC } from 'react'
import {
  getOrganizationRoleLabel,
  type OrganizationRole,
} from '../../permissions/organization-role'
import { $Badge } from './MemberRoleBadge.sc'

export interface IMemberRoleBadge {
  role: OrganizationRole
}

const MemberRoleBadge: FC<IMemberRoleBadge> = ({ role }) => {
  return <$Badge $role={role}>{getOrganizationRoleLabel(role)}</$Badge>
}

export default MemberRoleBadge
