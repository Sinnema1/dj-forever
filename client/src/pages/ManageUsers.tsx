import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";
import { REMOVE_USER } from "../graphql/mutations";
import { User } from "../interfaces/User";
import { UserRoundX } from "lucide-react";

export default function ManageUsers() {
    const {loading,data,refetch} = useQuery(GET_USERS);
    const [removeUser] = useMutation(REMOVE_USER,{onCompleted:() => {refetch()}});
       
    if (loading)
    {
      return <div> Loading.. </div>
    }
   
    //Delete User 
    const deleteUser = (id: string) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this User?");
      if (confirmDelete) {
        removeUser({variables:{userId:id}})
      }
    }
    //console.log(data.getUsers);
    return (
      <div>
        <h1> Manage Users</h1>   
        <table className="usertable-container">
          <thead>
            <tr className="userheader">
              <th> Username </th>
              <th> Email </th>
              <th> Current Reading </th>
              <th> Favourite Count </th>
              <th> Finished Reading </th>
              <th> Want to Read </th>
              <th> Book Count </th>
              <th> Is Admin? </th>
              <th> Delete </th>
            </tr>
          </thead>
          <tbody>
            {data?.getUsers.map((user:User) => (
              <tr key={String(user._id)}>
                <td className="userrow">{user.username}</td>
                <td>{user.email}</td>
                <td>{String(user.currentlyReadingCount)}</td>
                <td>{String(user.favoriteCount)}</td>
                <td>{String(user.finishedReadingCount)}</td>
                <td>{String(user.wantToReadCount)}</td>
                <td>{String(user.bookCount)}</td>
                <td>{ user.isAdmin ? "True" : "False" }</td>
                <td>
                    { !user.isAdmin ? <button type='button' id='DeleteBtn' onClick ={() => deleteUser(String(user._id))}> < UserRoundX ></UserRoundX> </button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
      
 

  