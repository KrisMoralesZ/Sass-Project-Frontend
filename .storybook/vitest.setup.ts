import { setProjectAnnotations } from '@storybook/react-vite'
import { beforeAll } from 'vitest'
import * as previewAnnotations from './preview'

/**
 * Applies Storybook preview annotations for Vitest portable stories.
 * Kept explicit to avoid Storybook 10.3+ auto-provisioning conflicts
 * with the a11y addon dependency graph in this toolchain.
 *
 * @see https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
 */
const annotations = setProjectAnnotations([previewAnnotations])

beforeAll(annotations.beforeAll)
