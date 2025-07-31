import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AccordionTransition({ title, children, defaultExpanded = false }) {
    const [expanded, setExpanded] = React.useState(defaultExpanded);

    const handleExpansion = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <Accordion expanded={expanded} onChange={handleExpansion}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon className="expand-icon" />}
            >
                <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>

            <style jsx global>{`
       
        .MuiAccordionSummary-expandIconWrapper.Mui-expanded {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }
        .MuiAccordionSummary-expandIconWrapper {
          transition: transform 0.3s ease;
        }
      `}</style>
        </Accordion>
    );
}
