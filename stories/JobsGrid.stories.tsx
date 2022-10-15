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

export const Default = Template.bind({});

const today = new Date();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
Default.args = {
    rows: [{
        name: "mock-test-1",
        executions: [
            {
                id: "1",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "2",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "3",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "4",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "5",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "6",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "7",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "8",
                runAttempt: 1,
                conclusion: "pending",
                link: "https://github.com",
            },
        ]
    },
    {
        name: "mock-test-2",
        executions: [
            {
                id: "1",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            }, null, null, {
                id: "4",
                runAttempt: 1,
                conclusion: "pending",
                link: "https://github.com",
            },
            {
                id: "5",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            null,
            {
                id: "7",
                runAttempt: 1,
                conclusion: "success",
                link: "https://github.com",
            },
            {
                id: "8",
                runAttempt: 1,
                conclusion: "failure",
                link: "https://github.com",
            },
        ]
    }],
    columns: [
        {
            date: today,
            children: [
                {
                    timeByMinutes: today,
                    children: [
                        {
                            commit: "12345678"
                        },
                        {
                            commit: "22345678"
                        },
                        {
                            commit: "32345678"
                        },
                        {
                            commit: "42345678"
                        },
                    ]
                }
            ],
        },
        {
            date: yesterday,
            children: [
                {
                    timeByMinutes: yesterday,
                    children: [
                        {
                            commit: "12345678"
                        },
                        {
                            commit: "22345678"
                        },
                        {
                            commit: "32345678"
                        },
                        {
                            commit: "42345678"
                        },
                    ]
                }
            ],
        }
    ]
} as JobsGridProps;
