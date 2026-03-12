const sequelize = require('./Config/db');

(async () => {
    try {
        console.log('Starting cleanup of duplicate attendance records...');
        
        // Find duplicates and keep only the one with the highest att_id (latest)
        const [duplicates] = await sequelize.query(`
            SELECT student_id, subject_id, att_date, COUNT(*) as count
            FROM attendances
            GROUP BY student_id, subject_id, att_date
            HAVING count > 1
        `);

        console.log(`Found ${duplicates.length} sets of duplicates.`);

        for (const dup of duplicates) {
            const { student_id, subject_id, att_date } = dup;
            
            // Get all IDs for this specific combination
            const [records] = await sequelize.query(`
                SELECT att_id FROM attendances 
                WHERE student_id = :student_id 
                AND subject_id = :subject_id 
                AND att_date = :att_date
                ORDER BY att_id DESC
            `, {
                replacements: { student_id, subject_id, att_date }
            });

            // Keep the first one (latest), delete the rest
            const idsToDelete = records.slice(1).map(r => r.att_id);
            if (idsToDelete.length > 0) {
                await sequelize.query(`
                    DELETE FROM attendances WHERE att_id IN (:idsToDelete)
                `, {
                    replacements: { idsToDelete }
                });
                console.log(`Deleted ${idsToDelete.length} duplicates for student ${student_id}, subject ${subject_id}, date ${att_date}`);
            }
        }

        console.log('Cleanup completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
})();
