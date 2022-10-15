import React from "react"
import { ComponentStory, ComponentMeta } from '@storybook/react';
import testdata from './jobs-grid-testdata.json';

import JobsGrid, { JobRun } from '../components/jobs-grid';
import { JobsGridProps } from '../components/jobs-grid';

export default {
    title: 'JobsGrid',
    component: JobsGrid,
    argTypes: {
        rows: { control: 'array' }
    }
} as ComponentMeta<typeof JobsGrid>;

const Template: ComponentStory<typeof JobsGrid> = (args) => <JobsGrid {...args} />;

export const Default = Template.bind({});

Default.args = {
    workflowRuns: testdata as any
};
