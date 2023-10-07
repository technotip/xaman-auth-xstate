import { Form } from "@remix-run/react";
export default function DashboardComponent({ user }: any) {
  const people = [
    {
      name: user?.name,
      raddress: user?.raddress,
      role: user?.role,
      verified: user?.verified,
    },
  ];
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">Registered User</div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Form method="post">
            <button
              type="submit"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Delete user
            </button>
          </Form>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    raddress
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Verified
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={1}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium bg-red-100 border-red-400 text-red-700 sm:pl-0">
                      {person.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm bg-yellow-100 border-yellow-400 text-yellow-700">
                      {person.raddress}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm bg-green-100 border-green-400 text-green-700">
                      {person.role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm bg-blue-100 border-blue-400 text-blue-700">
                      {person.verified.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="py-14">
              * If you delete your account and try to login, it'll give you a
              message that the user does not exist. You'll have to signup once
              again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
