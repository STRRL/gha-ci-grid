import React from "react"
import { ComponentStory, ComponentMeta } from '@storybook/react';

import JobsGrid from '../components/jobs-grid';
import { JobsGridProps } from '../components/jobs-grid';

export default {
    title: 'JobsGrid',
    component: JobsGrid,
    argTypes: {
        rows: { control: 'array' }
    }
} as ComponentMeta<typeof JobsGrid>;

const Template: ComponentStory<typeof JobsGrid> = (args) => <JobsGrid {...args} />;

const now = new Date();
export const Default = Template.bind({});

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
Default.args = {
    rows: [
        {
            name: 'ci pipeline #1',
            children: [
                {
                    date: now,
                    children: [
                        {
                            timeByMinutes: now,
                            children: [
                                {
                                    commit: '1234567890',
                                    children: [
                                        {
                                            runAttempt: 1,
                                            conclusion: 'success',
                                            link: 'https://github.com'
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }, {
            name: 'ci pipeline #2',
            children: [
                {
                    date: yesterday,
                    children: [
                        {
                            timeByMinutes: yesterday,
                            children: [
                                {
                                    commit: "aabbccdd",
                                    children: [
                                        {
                                            runAttempt: 1,
                                            conclusion: 'failure',
                                            link: "https://github.com"
                                        },
                                        {
                                            runAttempt: 2,
                                            conclusion: 'success',
                                            link: "https://github.com"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    ]
};
