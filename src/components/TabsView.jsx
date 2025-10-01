import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ClassStructure from './ClassStructure'; 
import Schedule from './Schedule';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
       <Box
  sx={{
    p: { xs: 2, sm: 3 },
    backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900/80
    borderRadius: '12px',
    mt: 2,
    color: 'white',
  }}
>
  {children}
</Box>

      )}
    </div>
  );
}

export default function TabsView() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
        <Tabs
  value={value}
  onChange={handleChange}
  textColor="inherit"
  variant="scrollable"
  scrollButtons="auto"
  TabIndicatorProps={{ style: { backgroundColor: '#06b6d4' } }} // cyan-500
>
  <Tab label="Structure" sx={{ color: 'white', fontWeight: 'bold' }} />
  <Tab label="Schedule" sx={{ color: 'white', fontWeight: 'bold' }} />
</Tabs>

      </Box>
      <TabPanel value={value} index={0}>
        <ClassStructure />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Schedule />
      </TabPanel>
    </Box>
  );
}
