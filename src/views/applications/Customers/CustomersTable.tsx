import { FC, useState, useEffect } from "react";
import Moment from "moment";
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Pagination,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Rating,
  TextField,
} from "@mui/material";
import { CryptoOrder, CryptoOrderStatus } from "src/models/crypto_order";
import { Link } from "react-router-dom";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { BlockTwoTone } from "@mui/icons-material";
import { DownloadTwoTone } from "@mui/icons-material";
import { SearchTwoTone } from "@mui/icons-material";
import { IUser } from "src/models";

interface CustomersTableProps {
  handlePagechange: (params: object) => void;
  _export: () => void;
  className?: string;
  customers: Array<IUser>;
  total: number;
  pages: number;
  activePage: number;
  term: string;
  offset: number;
}

const applyPagination = (
  cryptoOrders: CryptoOrder[],
  page: number,
  limit: number
): CryptoOrder[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const CustomersTable: FC<CustomersTableProps> = ({
  customers,
  handlePagechange,
  _export,
  total,
  pages,
  activePage,
  term,
  offset,
}) => {
  const [q, setTerm] = useState(term);
  const [firstRender, setFirstRender] = useState(true);
  const theme = useTheme();

  const onChange = (value) => {
    setTerm(value);
  };

  useEffect(() => {
    setFirstRender(false);
  }, [customers]);

  useEffect(() => {
    if ((!firstRender && q.length === 0) || q.length > 2) {
      const timeoutId = setTimeout(() => {
        const params = {
          q,
          page: 1,
        };
        handlePagechange(params);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [q]);

  const handlePagination = (event: any, newPage: number): void => {
    const params = {
      q: q,
      page: newPage,
    };
    handlePagechange(params);
  };

  return (
    <Card>
      <Box style={{ flex: 1, flexDirection: "row" }}>
        <TextField
          value={q}
          fullWidth
          variant="outlined"
          placeholder="Search by firstname, lastname, email ..."
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" aria-label="search">
                <SearchTwoTone style={{ fill: "blue" }} />
              </IconButton>
            ),
          }}
        />
      </Box>
      {customers.length ? (
        <Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Details</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email Adress</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Create at</TableCell>
                  <TableCell>Last update</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => {
                  return (
                    <TableRow hover key={customer._id}>
                      <TableCell>
                        <Link to={`${customer._id}/bookings`}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                          >
                            {customer.fullname}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {customer.firstname}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {customer.lastname}
                        </Typography>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        {Moment(customer.created_at).format("ll")}
                      </TableCell>
                      <TableCell>
                        {Moment(customer.updated_at).format("ll")}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Block Customer" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.primary.lighter,
                              },
                              color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"
                          >
                            <BlockTwoTone fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Customer" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.error.lighter,
                              },
                              color: theme.palette.error.main,
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid
              item
              style={{
                flex: 1,
              }}
            >
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<DownloadTwoTone fontSize="small" />}
                onClick={() => _export()}
              >
                Export bookings
              </Button>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={3}
              style={{
                flex: 1,
                marginTop: 5,
              }}
            >
              <Pagination
                count={pages}
                page={activePage}
                color="primary"
                showFirstButton
                showLastButton
                onChange={handlePagination}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: 30, padding: 10 }}
        >
          <Typography variant="subtitle2">No customers found</Typography>
        </Grid>
      )}
    </Card>
  );
};

export default CustomersTable;
