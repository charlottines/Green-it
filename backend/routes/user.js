router.get('/:id/groups', async (req, res) => {
    const userId = req.params.id;

    try {
        const [groups] = await pool.query(
            `SELECT g.id, g.name, g.description,
                    IF(g.admin_id = ?, 'admin', 'member') AS role
             FROM user_groups ug
             JOIN groups g ON g.id = ug.group_id
             WHERE ug.user_id = ?`,
            [userId, userId]
        );

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des groupes' });
    }
});
