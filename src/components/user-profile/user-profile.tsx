import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { User } from "../../interfaces/user.interface";
import userService from "../../services/user.service";
import { useFormik } from "formik";
import Snackbar from "@mui/material/Snackbar";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [forCreation, setForCreation] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      name: "",
      age: 0,
      email: "",
      statusMessage: "",
      avatarUrl: "",
      isPublic: false,
    },
    onSubmit: (values) => {
      submitCreateAndUpdateUser(values);
    },
  });

  const goBack = () => {
    navigate("/users-list");
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const submitCreateAndUpdateUser = (user: Partial<User>) => {
    if (forCreation) {
      userService.createUser(user).then((res) => {
        if (res.status === 201 || res.status === 200) {
          setSnackOpen(true);
          setSnackMessage("User created successfully");
        }
      });
    } else {
      user["id"] = currentUser?.id;
      userService.updateUser(user).then((res) => {
        if (res.status === 200) {
          setSnackOpen(true);
          setSnackMessage("User updated successfully");
        }
      });
    }
  };

  const deleteUser = () => {
    userService.deleteUser(currentUser!.id).then((res) => {
      setSnackOpen(true);
      setSnackMessage("User updated successfully. Redirecting...");
      setTimeout(() => {
        navigate("/users-list");
      }, 1000);
    });
  };

  useEffect(() => {
    if (!id) {
      setForCreation(true);
    } else {
      setForCreation(false);
      userService.getUser(parseInt(id)).then((res) => {
        setCurrentUser(res.data);
        let user = res.data;
        formik.setValues({
          name: user.name ?? "",
          age: user.age ?? 0,
          email: user.email ?? "",
          statusMessage: user.statusMessage ?? "",
          avatarUrl: user.avatarUrl ?? "",
          isPublic: user.isPublic ?? false,
        });
      });
    }
  }, []);

  return (
    <div id="wrapperDiv" className="w-1/3 m-auto mt-8">
      <form
        className="flex flex-col gap-2 border-2 border-gray-800 p-8 rounded-md"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex items-center justify-center gap-4">
          {!forCreation && currentUser && (
            <img
              src={formik.values.avatarUrl}
              alt="User Avatar"
              width="100"
              height="100"
            />
          )}
          <div className="flex flex-col items-center justify-center gap-4">
            <TextField
              required
              type="text"
              label="Name"
              name="name"
              placeholder="Name of User"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              required
              label="Age"
              type="number"
              name="age"
              placeholder="Age of User"
              value={formik.values.age}
              onChange={formik.handleChange}
            />
            <TextField
              required
              label="Email"
              type="email"
              name="email"
              placeholder="Email of User"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              required
              label="Status Message"
              placeholder="Status of User"
              name="statusMessage"
              value={formik.values.statusMessage}
              onChange={formik.handleChange}
            />
            <TextField
              label="Avatar URL"
              placeholder="URL for User Avatar"
              name="avatarUrl"
              value={formik.values.avatarUrl}
              onChange={formik.handleChange}
            />
            {forCreation && currentUser && <span>{currentUser.createdAt}</span>}
            <div className="flex items-center justify-center gap-4">
              <Checkbox
                name="isPublic"
                onChange={formik.handleChange}
                checked={formik.values.isPublic}
              />
              <span>Display as Public</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="contained" type="submit">
            {forCreation ? "Create" : "Update"} User
          </Button>
          {forCreation && (
            <Button variant="contained" color="secondary" onClick={goBack}>
              Cancel
            </Button>
          )}
          {!forCreation && (
            <Button variant="contained" color="error" onClick={deleteUser}>
              Delete User
            </Button>
          )}
        </div>
      </form>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default UserProfile;
