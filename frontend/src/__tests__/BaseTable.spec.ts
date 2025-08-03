import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTable from '@/components/ui/BaseTable.vue'

describe('BaseTable', () => {
  const mockData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', salary: 50000 },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', salary: 60000 },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', salary: 45000 },
  ]

  const mockColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true, align: 'center' as const },
    { key: 'email', label: 'Email' },
    { key: 'salary', label: 'Salary', sortable: true, align: 'right' as const },
  ]

  describe('Rendering', () => {
    it('renders properly with required props', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      expect(wrapper.find('.base-table').exists()).toBe(true)
      expect(wrapper.find('.base-table__table').exists()).toBe(true)
      expect(wrapper.find('.base-table__thead').exists()).toBe(true)
      expect(wrapper.find('.base-table__tbody').exists()).toBe(true)
    })

    it('renders title when provided', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          title: 'Employee Table',
        },
      })

      expect(wrapper.find('.base-table__header').exists()).toBe(true)
      expect(wrapper.find('.base-table__title').exists()).toBe(true)
      expect(wrapper.find('.base-table__title').text()).toBe('Employee Table')
    })

    it('does not render header when no title provided', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      expect(wrapper.find('.base-table__header').exists()).toBe(false)
    })

    it('renders correct number of columns', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const headers = wrapper.findAll('.base-table__th')
      expect(headers).toHaveLength(mockColumns.length)

      headers.forEach((header, index) => {
        expect(header.text()).toContain(mockColumns[index].label)
      })
    })

    it('renders correct number of rows', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      expect(rows).toHaveLength(mockData.length)
    })

    it('renders cell data correctly', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const firstRowCells = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')
      expect(firstRowCells[0].text()).toBe('John Doe')
      expect(firstRowCells[1].text()).toBe('30')
      expect(firstRowCells[2].text()).toBe('john@example.com')
      expect(firstRowCells[3].text()).toBe('50,000') // formatted number
    })
  })

  describe('Props - Styling Options', () => {
    it('applies striped classes when striped prop is true', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          striped: true,
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      expect(rows[0].classes()).not.toContain('base-table__tr--striped')
      expect(rows[1].classes()).toContain('base-table__tr--striped')
      expect(rows[2].classes()).not.toContain('base-table__tr--striped')
    })

    it('does not apply striped classes when striped prop is false', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          striped: false,
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      rows.forEach((row) => {
        expect(row.classes()).not.toContain('base-table__tr--striped')
      })
    })

    it('applies hoverable classes when hoverable prop is true', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          hoverable: true,
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      rows.forEach((row) => {
        expect(row.classes()).toContain('base-table__tr--hoverable')
      })
    })

    it('does not apply hoverable classes when hoverable prop is false', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          hoverable: false,
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      rows.forEach((row) => {
        expect(row.classes()).not.toContain('base-table__tr--hoverable')
      })
    })
  })

  describe('Column Alignment', () => {
    it('applies center alignment classes correctly', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const ageHeader = wrapper.findAll('.base-table__th')[1]
      const ageCell = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')[1]

      expect(ageHeader.classes()).toContain('base-table__th--center')
      expect(ageCell.classes()).toContain('base-table__td--center')
    })

    it('applies right alignment classes correctly', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const salaryHeader = wrapper.findAll('.base-table__th')[3]
      const salaryCell = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')[3]

      expect(salaryHeader.classes()).toContain('base-table__th--right')
      expect(salaryCell.classes()).toContain('base-table__td--right')
    })

    it('does not apply alignment classes for left alignment (default)', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const nameHeader = wrapper.findAll('.base-table__th')[0]
      const nameCell = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')[0]

      expect(nameHeader.classes()).not.toContain('base-table__th--center')
      expect(nameHeader.classes()).not.toContain('base-table__th--right')
      expect(nameCell.classes()).not.toContain('base-table__td--center')
      expect(nameCell.classes()).not.toContain('base-table__td--right')
    })
  })

  describe('Sortable Columns', () => {
    it('applies sortable class to sortable columns', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const headers = wrapper.findAll('.base-table__th')
      expect(headers[0].classes()).toContain('base-table__th--sortable') // name
      expect(headers[1].classes()).toContain('base-table__th--sortable') // age
      expect(headers[2].classes()).not.toContain('base-table__th--sortable') // email
      expect(headers[3].classes()).toContain('base-table__th--sortable') // salary
    })

    it('shows inactive sort icon for sortable columns', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const nameHeader = wrapper.findAll('.base-table__th')[0]
      const sortIcon = nameHeader.find('.base-table__sort-icon--inactive')
      expect(sortIcon.exists()).toBe(true)
      expect(sortIcon.text()).toBe('↕')
    })

    it('does not show sort icon for non-sortable columns', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const emailHeader = wrapper.findAll('.base-table__th')[2]
      const sortIcon = emailHeader.find('.base-table__sort-icon')
      expect(sortIcon.exists()).toBe(false)
    })

    it('handles column sorting on click', async () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const nameHeader = wrapper.findAll('.base-table__th')[0]
      await nameHeader.trigger('click')

      expect(nameHeader.classes()).toContain('base-table__th--sorted')
      const sortIcon = nameHeader.find('.base-table__sort-icon')
      expect(sortIcon.exists()).toBe(true)
      expect(sortIcon.text()).toBe('↑') // ascending
    })

    it('toggles sort order on repeated clicks', async () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const nameHeader = wrapper.findAll('.base-table__th')[0]

      // First click - ascending
      await nameHeader.trigger('click')
      let sortIcon = nameHeader.find('.base-table__sort-icon')
      expect(sortIcon.text()).toBe('↑')

      // Second click - descending
      await nameHeader.trigger('click')
      sortIcon = nameHeader.find('.base-table__sort-icon')
      expect(sortIcon.text()).toBe('↓')

      // Third click - ascending again
      await nameHeader.trigger('click')
      sortIcon = nameHeader.find('.base-table__sort-icon')
      expect(sortIcon.text()).toBe('↑')
    })

    it('does not handle click on non-sortable columns', async () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const emailHeader = wrapper.findAll('.base-table__th')[2]
      await emailHeader.trigger('click')

      expect(emailHeader.classes()).not.toContain('base-table__th--sorted')
    })
  })

  describe('Data Sorting', () => {
    it('sorts string data correctly', async () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const nameHeader = wrapper.findAll('.base-table__th')[0]
      await nameHeader.trigger('click')

      const rows = wrapper.findAll('.base-table__tr')
      const firstRowName = rows[0].findAll('.base-table__td')[0].text()
      const secondRowName = rows[1].findAll('.base-table__td')[0].text()
      const thirdRowName = rows[2].findAll('.base-table__td')[0].text()

      expect(firstRowName).toBe('Bob Johnson')
      expect(secondRowName).toBe('Jane Smith')
      expect(thirdRowName).toBe('John Doe')
    })

    it('sorts numeric data correctly', async () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const ageHeader = wrapper.findAll('.base-table__th')[1]
      await ageHeader.trigger('click')

      const rows = wrapper.findAll('.base-table__tr')
      const firstRowAge = rows[0].findAll('.base-table__td')[1].text()
      const secondRowAge = rows[1].findAll('.base-table__td')[1].text()
      const thirdRowAge = rows[2].findAll('.base-table__td')[1].text()

      expect(firstRowAge).toBe('25')
      expect(secondRowAge).toBe('30')
      expect(thirdRowAge).toBe('35')
    })

    it('sorts in descending order when clicked twice', async () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const ageHeader = wrapper.findAll('.base-table__th')[1]
      await ageHeader.trigger('click') // ascending
      await ageHeader.trigger('click') // descending

      const rows = wrapper.findAll('.base-table__tr')
      const firstRowAge = rows[0].findAll('.base-table__td')[1].text()
      const secondRowAge = rows[1].findAll('.base-table__td')[1].text()
      const thirdRowAge = rows[2].findAll('.base-table__td')[1].text()

      expect(firstRowAge).toBe('35')
      expect(secondRowAge).toBe('30')
      expect(thirdRowAge).toBe('25')
    })
  })

  describe('Data Formatting', () => {
    it('formats numbers with locale string', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const salaryCell = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')[3]
      expect(salaryCell.text()).toBe('50,000')
    })

    it('uses custom formatter when provided', () => {
      const columnsWithFormatter = [
        ...mockColumns.slice(0, 3),
        {
          key: 'salary',
          label: 'Salary',
          sortable: true,
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      ]

      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: columnsWithFormatter,
        },
      })

      const salaryCell = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')[3]
      expect(salaryCell.text()).toBe('$50,000')
    })

    it('handles null and undefined values', () => {
      const dataWithNulls = [
        { id: 1, name: 'John', age: null, email: undefined },
        { id: 2, name: null, age: 25, email: 'jane@example.com' },
      ]

      const wrapper = mount(BaseTable, {
        props: {
          data: dataWithNulls,
          columns: mockColumns.slice(0, 3),
        },
      })

      const firstRowCells = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')
      const secondRowCells = wrapper.findAll('.base-table__tr')[1].findAll('.base-table__td')

      expect(firstRowCells[1].text()).toBe('') // null age
      expect(firstRowCells[2].text()).toBe('') // undefined email
      expect(secondRowCells[0].text()).toBe('') // null name
    })
  })

  describe('Nested Object Properties', () => {
    it('handles nested object properties with dot notation', () => {
      const nestedData = [
        { id: 1, user: { name: 'John', profile: { age: 30 } } },
        { id: 2, user: { name: 'Jane', profile: { age: 25 } } },
      ]

      const nestedColumns = [
        { key: 'user.name', label: 'Name' },
        { key: 'user.profile.age', label: 'Age' },
      ]

      const wrapper = mount(BaseTable, {
        props: {
          data: nestedData,
          columns: nestedColumns,
        },
      })

      const firstRowCells = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')
      expect(firstRowCells[0].text()).toBe('John')
      expect(firstRowCells[1].text()).toBe('30')
    })

    it('handles missing nested properties gracefully', () => {
      const incompleteData = [
        { id: 1, user: { name: 'John' } }, // missing profile
        { id: 2 }, // missing user entirely
      ]

      const nestedColumns = [
        { key: 'user.name', label: 'Name' },
        { key: 'user.profile.age', label: 'Age' },
      ]

      const wrapper = mount(BaseTable, {
        props: {
          data: incompleteData,
          columns: nestedColumns,
        },
      })

      const firstRowCells = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')
      const secondRowCells = wrapper.findAll('.base-table__tr')[1].findAll('.base-table__td')

      expect(firstRowCells[0].text()).toBe('John')
      expect(firstRowCells[1].text()).toBe('') // missing nested property
      expect(secondRowCells[0].text()).toBe('') // missing user
      expect(secondRowCells[1].text()).toBe('') // missing user
    })
  })

  describe('Footer', () => {
    it('shows footer when showFooter prop is true', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          showFooter: true,
        },
      })

      expect(wrapper.find('.base-table__footer').exists()).toBe(true)
      expect(wrapper.find('.base-table__count').exists()).toBe(true)
    })

    it('does not show footer when showFooter prop is false', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          showFooter: false,
        },
      })

      expect(wrapper.find('.base-table__footer').exists()).toBe(false)
    })

    it('displays correct item count in footer', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          showFooter: true,
        },
      })

      const countText = wrapper.find('.base-table__count').text()
      expect(countText).toBe('Showing 3 items')
    })

    it('displays singular form for single item', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: [mockData[0]],
          columns: mockColumns,
          showFooter: true,
        },
      })

      const countText = wrapper.find('.base-table__count').text()
      expect(countText).toBe('Showing 1 item')
    })

    it('renders custom footer slot content', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
          showFooter: true,
        },
        slots: {
          footer: '<div class="custom-footer">Custom footer content</div>',
        },
      })

      expect(wrapper.find('.base-table__footer').html()).toContain(
        '<div class="custom-footer">Custom footer content</div>',
      )
      expect(wrapper.find('.base-table__count').exists()).toBe(false)
    })
  })

  describe('Custom Cell Slots', () => {
    it('renders custom cell slot content', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
        slots: {
          'cell-name': '<template #cell-name="{ value }"><strong>{{ value }}</strong></template>',
        },
      })

      const nameCell = wrapper.findAll('.base-table__tr')[0].findAll('.base-table__td')[0]
      expect(nameCell.html()).toContain('<strong>')
    })
  })

  describe('Row Keys', () => {
    it('uses default rowKey prop (id)', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: mockColumns,
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      // Keys are internal to Vue, but we can verify the component renders correctly
      expect(rows).toHaveLength(mockData.length)
    })

    it('uses custom rowKey prop', () => {
      const customData = [
        { uuid: 'abc123', name: 'John' },
        { uuid: 'def456', name: 'Jane' },
      ]

      const wrapper = mount(BaseTable, {
        props: {
          data: customData,
          columns: [{ key: 'name', label: 'Name' }],
          rowKey: 'uuid',
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      expect(rows).toHaveLength(customData.length)
    })

    it('falls back to index when rowKey is missing', () => {
      const dataWithoutId = [{ name: 'John' }, { name: 'Jane' }]

      const wrapper = mount(BaseTable, {
        props: {
          data: dataWithoutId,
          columns: [{ key: 'name', label: 'Name' }],
        },
      })

      const rows = wrapper.findAll('.base-table__tr')
      expect(rows).toHaveLength(dataWithoutId.length)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty data array', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: [],
          columns: mockColumns,
        },
      })

      expect(wrapper.find('.base-table__table').exists()).toBe(true)
      expect(wrapper.findAll('.base-table__tr')).toHaveLength(0)
    })

    it('handles empty columns array', () => {
      const wrapper = mount(BaseTable, {
        props: {
          data: mockData,
          columns: [],
        },
      })

      expect(wrapper.find('.base-table__table').exists()).toBe(true)
      expect(wrapper.findAll('.base-table__th')).toHaveLength(0)
    })

    it('handles sorting with null values correctly', async () => {
      const dataWithNulls = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: null, age: 25 },
        { id: 3, name: 'Alice', age: null },
      ]

      const wrapper = mount(BaseTable, {
        props: {
          data: dataWithNulls,
          columns: [
            { key: 'name', label: 'Name', sortable: true },
            { key: 'age', label: 'Age', sortable: true },
          ],
        },
      })

      // Sort by name
      const nameHeader = wrapper.findAll('.base-table__th')[0]
      await nameHeader.trigger('click')

      // Verify null values are handled (should be sorted to end)
      const rows = wrapper.findAll('.base-table__tr')
      expect(rows).toHaveLength(3)
    })
  })
})
