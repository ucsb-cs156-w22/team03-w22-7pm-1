import React from 'react';

import EarthquakesTable from "main/components/Earthquakes/EarthquakesTable";
import { EarthquakesFixtures } from 'fixtures/EarthquakesFixtures';

export default {
    title: 'components/Earthquakes/EarthquakesTable',
    component: EarthquakesTable
};

const Template = (args) => {
    return (
        <EarthquakesTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    Earthquake: []
};

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    Earthquake: EarthquakesFixtures.threeEarthquakes

};



