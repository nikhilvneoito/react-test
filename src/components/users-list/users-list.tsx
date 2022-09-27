import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { User } from "../../interfaces/user.interface";
import { Options } from "../../interfaces/options.interface";
import { USER_CONSTANTS } from "../../constants/user.constant";
import { getUsers } from "../../store/slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [dropDownOptions, setDropDownOptions] = useState<Options[]>(
    USER_CONSTANTS.SORT_BY_DROP_DOWN
  );
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalLengthPage, setTotalLengthPage] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("created_At");

  const usersDispatch = useDispatch<AppDispatch>();
  const usersSelector = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const handleSearch = (searchKey: any) => {
    console.log(usersSelector.data.users);
    setPageNumber(0);
    setSearchKeyword(searchKey);
    usersDispatch(
      getUsers({
        key: searchKey,
        criteria: sortCriteria,
        page: 1,
      })
    );
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setPageNumber(0);
    setSortCriteria(event.target.value);
    usersDispatch(
      getUsers({
        key: searchKeyword,
        criteria: event.target.value,
        page: 1,
      })
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
    usersDispatch(
      getUsers({
        key: searchKeyword,
        criteria: sortCriteria,
        page: newPage + 1,
      })
    );
  };

  const handleCreateUserRoute = () => {
    navigate("/user-profile/new");
  };

  const goToUserProfile = (id: number) => {
    navigate(`/user-profile/${id}`);
  };

  useEffect(() => {
    usersDispatch(getUsers({ key: "", criteria: "", page: 1 }));
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full mt-8">
      <div className="flex items-center justify-center gap-4">
        <div className="text-xl font-semibold">Users List</div>
        <TextField
          label="Search"
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          className="w-[10rem]"
        />
        <FormControl className="w-[10rem]">
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortBy}
            label="Age"
            onChange={handleSortByChange}
          >
            {dropDownOptions.map((option: Options, index: number) => (
              <MenuItem key={index} value={option.value}>
                {option.viewValue}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div
        id="listDiv"
        className="w-full flex justify-center flex-wrap gap-4 min-h-[50%]"
      >
        {usersSelector.data.users.length !== 0 &&
          usersSelector.data.users.map((user: User, index: number) => (
            <div
              key={index}
              className="flex justify-evenly gap-4 sm:w-1/4 lg:w-1/5 border-2 border-gray-800 pt-2 cursor-pointer"
              onClick={() => goToUserProfile(user.id)}
            >
              <ul className="flex flex-col items-center">
                <img
                  src={user.avatarUrl}
                  alt="User Image"
                  width="75"
                  height="75"
                />
                <li className="font-bold">{user.age}</li>
              </ul>
              <ul className="flex flex-col">
                <li className="first-letter:uppercase font-bold">
                  {user.name}
                </li>
                <li className="first-letter:uppercase">{user.statusMessage}</li>
                <li>
                  {user.createdAt !== undefined
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </li>
                <li className="flex items-center justify-end">
                  {user.isPublic && <GroupIcon />}
                </li>
                <li className="flex items-center justify-end">
                  {!user.isPublic && <PersonOffIcon />}
                </li>
              </ul>
            </div>
          ))}
        {usersSelector.data.users.length === 0 && <div>No results found</div>}
      </div>
      <div className="flex items-center justify-center gap-8">
        <TablePagination
          component="div"
          count={usersSelector.data.totalLengthPage}
          page={pageNumber}
          onPageChange={handleChangePage}
          rowsPerPage={usersSelector.data.pageSize}
          rowsPerPageOptions={[10, 12, 20, 50, 100]}
        />
        <Button variant="contained" onClick={handleCreateUserRoute}>
          Create a User
        </Button>
      </div>
    </div>
  );
};

export default UsersList;
