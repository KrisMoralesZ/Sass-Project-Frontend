import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'
import {
  $Body,
  $Caption,
  $Cell,
  $Empty,
  $Head,
  $HeaderCell,
  $Row,
  $Scroll,
  $Table,
} from './Table.sc'

export type TableAlign = 'left' | 'center' | 'right'

export interface ITable extends TableHTMLAttributes<HTMLTableElement> {
  children?: ReactNode
}

export interface ITableCaption extends HTMLAttributes<HTMLTableCaptionElement> {
  children?: ReactNode
}

export interface ITableSection extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode
}

export interface ITableRow extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode
}

export interface ITableHeaderCell extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign
  children?: ReactNode
}

export interface ITableCell extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign
  children?: ReactNode
}

export interface ITableEmpty {
  colSpan: number
  children?: ReactNode
}

const Table: FC<ITable> = ({ children, ...rest }) => {
  return (
    <$Scroll>
      <$Table {...rest}>{children}</$Table>
    </$Scroll>
  )
}

export const TableCaption: FC<ITableCaption> = ({ children, ...rest }) => {
  return <$Caption {...rest}>{children}</$Caption>
}

export const TableHeader: FC<ITableSection> = ({ children, ...rest }) => {
  return <$Head {...rest}>{children}</$Head>
}

export const TableBody: FC<ITableSection> = ({ children, ...rest }) => {
  return <$Body {...rest}>{children}</$Body>
}

export const TableRow: FC<ITableRow> = ({ children, ...rest }) => {
  return <$Row {...rest}>{children}</$Row>
}

export const TableHead: FC<ITableHeaderCell> = ({
  align = 'left',
  children,
  ...rest
}) => {
  return (
    <$HeaderCell $align={align} scope="col" {...rest}>
      {children}
    </$HeaderCell>
  )
}

export const TableCell: FC<ITableCell> = ({
  align = 'left',
  children,
  ...rest
}) => {
  return (
    <$Cell $align={align} {...rest}>
      {children}
    </$Cell>
  )
}

export const TableEmpty: FC<ITableEmpty> = ({
  colSpan,
  children = 'No results found.',
}) => {
  return (
    <TableRow>
      <$Empty colSpan={colSpan}>{children}</$Empty>
    </TableRow>
  )
}

export default Table
