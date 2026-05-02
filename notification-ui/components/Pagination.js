import { Pagination as MuiPagination, Box } from "@mui/material";

export default function Pagination({ total, page, setPage, limit }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, val) => setPage(val)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
