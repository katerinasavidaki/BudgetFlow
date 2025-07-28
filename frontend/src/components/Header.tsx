import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Menu,
    X,
    LogOut,
    User,
    Plus,
    Home,
    List,
    LogIn,
    UserPlus,
    CirclePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {useAuth} from "@/hooks/useAuth.ts";

const bgColor = "#B4CCE4";

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, username, logout } = useAuth();

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <header className="w-full shadow-md fixed" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                    <img src="/logo.png" alt="BudgetFlow" className="w-16 h-16 rounded"/>
                    BudgetFlow
                </Link>

                <div className="hidden md:flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            {/*<Link to="/dashboard">*/}
                            {/*    <Button variant="ghost">*/}
                            {/*        <BarChart className="mr-1 h-4 w-4" /> Dashboard*/}
                            {/*    </Button>*/}
                            {/*</Link>*/}
                            <Link to="/transactions">
                                <Button variant="ghost">
                                    <List className="mr-1 h-4 w-4" /> Transactions
                                </Button>
                            </Link>
                            <Link to="/transactions/new">
                                <Button variant="ghost">
                                    <CirclePlus className="mr-1 h-4 w-4" />Add
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button variant="ghost">
                                    <Home className="mr-1 h-4 w-4" /> Home
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Button variant="ghost">
                                    <User className="mr-1 h-4 w-4" /> {username}
                                </Button>
                            </Link>
                            <Button variant="destructive"
                                    className="hover:bg-white hover:text-black cursor-pointer" onClick={logout}>
                                <LogOut className="mr-1 h-4 w-4" /> Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="outline">
                                    <LogIn className="mr-1 h-4 w-4" /> Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button>
                                    <UserPlus className="mr-1 h-4 w-4" /> Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={toggleMenu}>
                                {menuOpen ? <X /> : <Menu />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="p-6 space-y-4 bg-white">
                            {isAuthenticated ? (
                                <>
                                    {/*<Link to="/dashboard" onClick={toggleMenu}>*/}
                                    {/*    <Button variant="ghost" className="w-full justify-start">*/}
                                    {/*        <BarChart className="mr-2 h-4 w-4" /> Dashboard*/}
                                    {/*    </Button>*/}
                                    {/*</Link>*/}
                                    <Link to="/transactions" onClick={toggleMenu}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <List className="mr-2 h-4 w-4" /> Transactions
                                        </Button>
                                    </Link>
                                    <Link to="/transactions/new" onClick={toggleMenu}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Plus className="mr-2 h-4 w-4" /> Add
                                        </Button>
                                    </Link>
                                    <Link to="/" onClick={toggleMenu}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Home className="mr-2 h-4 w-4" /> Home
                                        </Button>
                                    </Link>
                                    <Link to="/profile" onClick={toggleMenu}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <User className="mr-2 h-4 w-4" /> Profile
                                        </Button>
                                    </Link>
                                    <Button variant="destructive" className="w-full justify-start" onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={toggleMenu}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <LogIn className="mr-2 h-4 w-4" /> Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={toggleMenu}>
                                        <Button className="w-full justify-start">
                                            <UserPlus className="mr-2 h-4 w-4" /> Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
