import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import EventIcon from "@mui/icons-material/Event";
import AllInboxIcon from "@mui/icons-material/AllInbox";

const TYPES = [
  { value: "All",       label: "All",       icon: <AllInboxIcon fontSize="small" /> },
  { value: "Placement", label: "Placement", icon: <SchoolIcon fontSize="small" /> },
  { value: "Result",    label: "Result",    icon: <BarChartIcon fontSize="small" /> },
  { value: "Event",     label: "Event",     icon: <EventIcon fontSize="small" /> },
];

export default function Filter({ filter, setFilter }) {
  return (
    <Box mb={2}>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, val) => val && setFilter(val)}
        size="small"
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {TYPES.map(({ value, label, icon }) => (
          <ToggleButton
            key={value}
            value={value}
            sx={{
              borderRadius: "20px !important",
              border: "1px solid rgba(0,0,0,0.15) !important",
              px: 2,
              fontWeight: 600,
              fontSize: "13px",
              gap: 0.5,
              "&.Mui-selected": {
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(25,118,210,0.4)",
              }
            }}
          >
            {icon} {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
