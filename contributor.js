                    <div className="flex-1 relative">
                      {/* <Input
                        placeholder="Type to search for registered users..."
                        value={contributor.userName || ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          updateContributor(index, "userName", newValue);
                          if (contributor.userId) {
                            updateContributor(index, "userId", ""); // Clear user ID when typing
                          }
                          setSearchTerms(prev => ({ ...prev, [index]: newValue }));
                          setActiveSearchIndex(index);
                        }}
                        onFocus={() => {
                          setActiveSearchIndex(index);
                          setSearchTerms(prev => ({ ...prev, [index]: contributor.userName || "" }));
                        }}
                        onBlur={() => setTimeout(() => setActiveSearchIndex(null), 200)}
                        className={contributor.userId ? "border-green-500 bg-green-50" : contributor.userName && !contributor.userId ? "border-red-500 bg-red-50" : ""}
                        data-testid={`input-contributor-search-${index}`}
                      /> */}
                      <Input
                        placeholder="Type to search for registered users..."
                        value={contributor.userName || ""}
                        onChange={(e) => handleSearchInputChange(index, e.target.value)} // SIMPLIFIED TO USE NEW FUNCTION
                      // ... rest of props
                      />
                      {currentSearchTerm && searchResults && searchResults.length > 0 && !contributor.userId && activeSearchIndex === index && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                          {searchResults.slice(0, 5).map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-gray-50"
                              // onClick={() => {
                              //   updateContributor(index, "userId", user.id);
                              //   updateContributor(index, "userName", `${user.firstName} ${user.lastName} (ID: ${user.id})`);
                              //   setSearchTerms(prev => ({ ...prev, [index]: "" }));
                              //   setActiveSearchIndex(null);
                              // }}
                              onClick={() => handleUserSelection(index, user)} // SIMPLIFIED TO USE NEW FUNCTION
                              data-testid={`button-select-user-${user.id}`}
                            >
                              {user.firstName} {user.lastName} (ID: {user.id})
                            </button>
                          ))}
                        </div>
                      )}
                      {contributor.userId && (
                        <div className="absolute right-2 top-2 text-green-600">
                          ✓
                        </div>
                      )}
                      {contributor.userName && !contributor.userId && (
                        <div className="absolute right-2 top-2 text-red-500">
                          !
                        </div>
                      )}
                      {currentSearchTerm && (!searchResults || searchResults.length === 0) && activeSearchIndex === index && currentSearchTerm.length > 2 && (
                        <div className="absolute z-10 w-full bg-white border border-red-300 rounded-md shadow-lg mt-1 p-3 text-sm text-red-600">
                          No users found. Make sure the person is registered in the system first.
                        </div>
                      )}
                    </div>