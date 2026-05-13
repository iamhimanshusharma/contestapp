import React, { useEffect, useState } from 'react'
import Header from './Header'
import { api } from './api'
import { useAuth } from './auth/AuthContext'

const Community = () => {
    const { isAuthenticated, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ title: "", body: "" });
    const [replyText, setReplyText] = useState({});
    const [message, setMessage] = useState("");

    const loadPosts = () => {
        api.get("/community")
            .then((res) => setPosts(res.data.posts))
            .catch(() => setMessage("Could not load community questions"));
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const submitQuestion = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!isAuthenticated) {
            setMessage("Login is required before posting a question");
            return;
        }

        try {
            const res = await api.post("/community", form);
            setPosts((current) => [res.data.post, ...current]);
            setForm({ title: "", body: "" });
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not post question");
        }
    };

    const submitReply = async (postId) => {
        setMessage("");

        if (!isAuthenticated) {
            setMessage("Login is required before replying");
            return;
        }

        try {
            const res = await api.post(`/community/${postId}/replies`, {
                body: replyText[postId] || ""
            });
            setPosts((current) => current.map((post) => (
                post._id === postId ? res.data.post : post
            )));
            setReplyText((current) => ({ ...current, [postId]: "" }));
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not post reply");
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex items-start justify-between gap-5 mb-6">
                        <div>
                            <p className="text-3xl font-bold text-gray-800">Community</p>
                            <p className="text-gray-600 mt-1">Ask coding questions, discuss edge cases, and help other users unblock submissions.</p>
                        </div>
                        {user && <p className="text-sm text-gray-500 shrink-0">Posting as @{user.username}</p>}
                    </div>

                    {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

                    <form onSubmit={submitQuestion} className="bg-white rounded-md p-5 ring-1 ring-gray-200 mb-6">
                        <p className="text-xl font-bold text-gray-800 mb-3">Post a Question</p>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Short title"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full mb-3"
                        />
                        <textarea
                            value={form.body}
                            onChange={(e) => setForm({ ...form, body: e.target.value })}
                            placeholder="Describe your query or question"
                            rows={4}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                        <div className="flex justify-end mt-3">
                            <button className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 cursor-pointer">
                                Post
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {posts.map((post) => (
                            <article key={post._id} className="bg-white rounded-md p-5 ring-1 ring-gray-200">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xl font-bold text-gray-800">{post.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            @{post.author?.username || "user"} - {new Date(post.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500">{post.replies?.length || 0} replies</p>
                                </div>
                                <p className="text-gray-700 mt-4 whitespace-pre-wrap">{post.body}</p>

                                <div className="mt-5 space-y-3">
                                    {post.replies?.map((reply) => (
                                        <div key={reply._id} className="bg-gray-50 rounded-md p-3 ring-1 ring-gray-100">
                                            <p className="text-sm text-gray-500">
                                                @{reply.author?.username || "user"} - {new Date(reply.createdAt).toLocaleString()}
                                            </p>
                                            <p className="text-gray-700 mt-1 whitespace-pre-wrap">{reply.body}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <input
                                        value={replyText[post._id] || ""}
                                        onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                                        placeholder="Write a reply"
                                        className="py-2 px-3 ring-2 ring-gray-200 rounded-md flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => submitReply(post._id)}
                                        className="py-2 px-4 bg-gray-900 text-white rounded-md shadow hover:bg-black cursor-pointer"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </article>
                        ))}
                        {posts.length === 0 && <p className="text-gray-500">No community questions yet.</p>}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Community
