import {
  Card, CardContent, Typography, Chip, Box, Badge
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import EventIcon from "@mui/icons-material/Event";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getPriorityColor, getPriorityBorder, getPriorityChipColor } from "../utils/helpers";

const TYPE_ICON = {
  Placement: <SchoolIcon fontSize="small" />,
  Result:    <BarChartIcon fontSize="small" />,
  Event:     <EventIcon fontSize="small" />,
};

export default function NotificationCard({ item, isRead, onRead }) {
  const borderColor = getPriorityBorder(item.Type);
  const bgColor     = getPriorityColor(item.Type);
  const chipColor   = getPriorityChipColor(item.Type);

  return (
    <Card
      onClick={() => !isRead && onRead && onRead(item.ID)}
      sx={{
        mb: 1.5,
        borderLeft: `5px solid ${borderColor}`,
        backgroundColor: isRead ? "#fafafa" : bgColor,
        opacity: isRead ? 0.82 : 1,
        cursor: isRead ? "default" : "pointer",
        boxShadow: isRead ? 0 : 2,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isRead ? 1 : 4,
        },
      }}
    >
      <CardContent sx={{ py: "10px !important", px: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={TYPE_ICON[item.Type]}
              label={item.Type}
              color={chipColor}
              size="small"
              variant={isRead ? "outlined" : "filled"}
            />
            {!isRead && (
              <Chip
                icon={<FiberNewIcon />}
                label="NEW"
                size="small"
                color="primary"
                sx={{ fontWeight: 700, fontSize: "10px" }}
              />
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">
              {new Date(item.Timestamp).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: isRead ? 400 : 600, color: isRead ? "text.secondary" : "text.primary" }}
        >
          {item.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
