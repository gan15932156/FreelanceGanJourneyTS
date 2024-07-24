const Page = ({ params }: { params: { token: string } }) => {
  return <div>Page token:{params.token}</div>;
};

export default Page;
