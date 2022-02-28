import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function EarthquakesForm({ initialEarthquake, submitAction, buttonLabel="Retrieve" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialEarthquake || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks


    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialEarthquake && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="EarthquakesForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialEarthquake.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="distance">Distance in km from Storke Tower (e.g. 100)</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-distance"
                    id="distance"
                    type="text"
                    isInvalid={Boolean(errors.distance)}
                    {...register("distance", {
                        required: "Distance is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.distance?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="minMag">Minimum Magnitude (e.g. 2.5)</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-minMag"
                    id="minMag"
                    type="text"
                    isInvalid={Boolean(errors.minMag)}
                    {...register("minMag", {
                        required: "Magnitude is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.minMag?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="retrieve"
                data-testid="EarthquakesForm-retrieve"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="EarthquakesForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default EarthquakesForm;