import { Appbar } from "@/components/Appbar";
import Header from "@/components/WebsitePage/Header";
// import SignIn from "@/components/SignIn";
import { getServerSession } from "next-auth";

export default async function () {
  const session = await getServerSession();
  return (
    <div>
      <Appbar />
      {/* <SignIn /> */}
      {/* <Header /> */}
      User Component 
      {JSON.stringify(session)}
    </div>
  )
}