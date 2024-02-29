const logout = async (context, sids: { [name: string]: string }) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            await context.cookies.delete('sid');
            delete sids[sid as string];
            context.response.body = { text: 'Successfully Logged Out' };
        }
    } catch (err) {
        console.log(err);
    }
};

export default logout;
