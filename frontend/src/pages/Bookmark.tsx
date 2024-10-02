import { useBookmarks } from "../hooks/bookmark";
import Appbar from "../components/Appbar";
import BlogSkeleton from "../components/BlogSkeleton";
import BookmarkCard from "../components/BookmarkCard";
import moment from "moment";
import { useCallback } from "react";

const Bookmark = () => {
  const { bookmarks, loading, GetBookmarks } = useBookmarks();

  const handleBookmarkDeleted = useCallback(() => {
    GetBookmarks();
  }, [GetBookmarks]);

  if (loading) {
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      </div>
    </div>;
  }

  return (
    <div>
      <Appbar />

      <div className="flex justify-center">
        <div>
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              id={bookmark.id}
              postId={bookmark.postId}
              authorName={bookmark.post.author.user.name || "ram"}
              title={bookmark.post.title}
              content={bookmark.post.content}
              publishDate={moment(bookmark.post.publishedDate).format(
                "DD-MMM-YYYY HH:mm:ss"
              )}
              onBookmarkDeleted={handleBookmarkDeleted}
            />
          ))}
        </div>
        {bookmarks.length === 0 && (
          <div className="flex justify-center mt-10">
            <h6 className="text-xl font-bold py-2">
              No bookmarks yet! You can bookmark blogs on the blog page{" "}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
