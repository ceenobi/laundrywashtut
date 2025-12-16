import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="space-y-20 py-10">
      <div className="pt-36 lg:pt-44 pb-4 text-center text-white space-y-4 px-4 sm:px-0">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Quick. Clean. Delivered.
        </h1>
        <p className="md:w-[70%] lg:w-[55%] xl:w-[45%] mx-auto">
          Laundry Wash helps you save time with fast, reliable pickup and
          delivery service. Because you deserve clean clothes without the wait.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/book-laundry">
            <button className="btn btn-lg rounded-full bg-indigoLight w-[211px]text-white font-medium truncate">
              Book Laundry
            </button>
          </Link>
          {!user && (
            <Link to="/login">
              <button className="btn btn-lg rounded-full bg-transparent border border-indigoLight w-[153px] text-indigoLight font-medium">
                Log In
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4">
        <img src="/heroBg.svg" alt="laundry-hero-image" className="w-full" />
      </div>
      <div className="bg-laundryDark py-20">
        <div className="container mx-auto px-4">
          <div className="md:grid grid-cols-12 gap-8">
            <div className="col-span-3 mb-8 md:mb-0">
              <button className="btn btn-lg rounded-full bg-indigoLight w-[211px]text-white font-medium truncate">
                Services
              </button>
            </div>
            <div className="col-span-9 space-y-4">
              <h1 className="text-2xl font-medium">
                Expert Care for Every Fabric
              </h1>
              <p>
                From gentle dry cleaning to precise ironing and everyday wash &
                fold — LaundryWash handles your clothes with the care they
                deserve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
