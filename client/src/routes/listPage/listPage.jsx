import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
      {/* Listings Panel */}
      <div className="flex-1 lg:w-3/5 overflow-y-auto">
        <div className="section-container py-6 space-y-6">
          <Filter />
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="text-center py-20">
                  <p className="text-navy-400 font-body text-body-lg">Error loading properties. Please try again.</p>
                </div>
              }
            >
              {(postResponse) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {postResponse.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))}
                  {postResponse.data.length === 0 && (
                    <div className="col-span-full text-center py-16">
                      <svg className="w-16 h-16 text-navy-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-navy-400 font-body text-body-lg">No properties found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Map Panel */}
      <div className="hidden lg:block lg:w-2/5 sticky top-[72px] h-[calc(100vh-72px)]">
        <Suspense
          fallback={
            <div className="w-full h-full bg-surface-100 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
            </div>
          }
        >
          <Await
            resolve={data.postResponse}
            errorElement={<p className="p-8 text-navy-400">Error loading map</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
